#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

required_files=(
  "$HARNESS_DIR/README.md"
  "$HARNESS_DIR/politics/models.yaml"
  "$HARNESS_DIR/politics/routing.yaml"
  "$HARNESS_DIR/politics/permissions.yaml"
  "$HARNESS_DIR/politics/state-machine.yaml"
  "$HARNESS_DIR/rules/coding.md"
  "$HARNESS_DIR/rules/workflow.md"
  "$HARNESS_DIR/schemas/plan.schema.yaml"
  "$HARNESS_DIR/schemas/task.schema.yaml"
  "$HARNESS_DIR/schemas/state.schema.yaml"
  "$HARNESS_DIR/schemas/evidence.schema.yaml"
  "$HARNESS_DIR/templates/plan.yaml"
  "$HARNESS_DIR/templates/task.yaml"
  "$HARNESS_DIR/templates/state.yaml"
  "$HARNESS_DIR/templates/evidence.yaml"
  "$HARNESS_DIR/checks/common.sh"
  "$HARNESS_DIR/checks/lint.sh"
  "$HARNESS_DIR/checks/typecheck.sh"
  "$HARNESS_DIR/checks/test.sh"
  "$HARNESS_DIR/checks/build.sh"
  "$HARNESS_DIR/checks/verify.sh"
  "$REPO_ROOT/AGENTS.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    printf 'Missing required Harness file: %s\n' "${file#"$REPO_ROOT/"}" >&2
    exit 1
  fi
done

ruby - "$HARNESS_DIR" <<'RUBY'
require "date"
require "yaml"

def load_yaml(file)
  YAML.safe_load(File.read(file), [Date, Time], [], false)
end

harness_dir = ARGV.fetch(0)
yaml_files = Dir[File.join(harness_dir, "**", "*.yaml")].sort
abort "No Harness YAML files found" if yaml_files.empty?

yaml_files.each do |file|
  begin
    YAML.parse_file(file)
  rescue StandardError => error
    abort "Invalid YAML in #{file}: #{error.message}"
  end
end

routing_file = File.join(harness_dir, "politics", "routing.yaml")
routing = load_yaml(routing_file)
route_ids = routing.fetch("routes").map { |route| route.fetch("id") }
if route_ids.uniq.length != route_ids.length
  abort "Duplicate route id in #{routing_file}"
end

models = load_yaml(File.join(harness_dir, "politics", "models.yaml"))
levels = models.fetch("levels").keys
roles = models.fetch("roles")
roles.each do |role, config|
  allowed = config.fetch("allowed_levels")
  unknown = allowed - levels
  abort "Role #{role} references unknown model levels: #{unknown.join(", ")}" unless unknown.empty?
end

routing.fetch("routes").each do |route|
  route.fetch("route").each do |role, level|
    next if role == "approval" || level.nil? || level == false
    abort "Route #{route.fetch("id")} references unknown model level: #{level}" if ["planner", "coder", "reviewer", "security"].include?(role) && !levels.include?(level)
  end
end

state_machine = load_yaml(File.join(harness_dir, "politics", "state-machine.yaml"))
state_machine.values.select { |value| value.is_a?(Hash) && value.key?("states") }.each do |machine|
  states = machine.fetch("states")
  machine.fetch("transitions").each do |from, destinations|
    abort "State machine references unknown state: #{from}" unless states.include?(from)
    destinations.each do |destination|
      abort "State machine references unknown destination: #{destination}" unless states.include?(destination)
    end
  end
end

template_kinds = {
  "plan.yaml" => "plan",
  "task.yaml" => "task",
  "state.yaml" => "state",
  "evidence.yaml" => "evidence"
}
template_kinds.each do |filename, expected_kind|
  template = load_yaml(File.join(harness_dir, "templates", filename))
  abort "Template #{filename} must have kind #{expected_kind}" unless template.fetch("kind") == expected_kind
end

runtime_files = Dir[File.join(harness_dir, "runtime", "**", "*.yaml")].sort
runtime_files.each do |file|
  data = load_yaml(file)
  expected_kind = if file.include?("/plans/")
                    "plan"
                  elsif file.include?("/tasks/")
                    "task"
                  elsif file.end_with?(".evidence.yaml")
                    "evidence"
                  elsif file.include?("/states/")
                    "state"
                  end
  abort "Runtime artifact #{file} has no recognized location" unless expected_kind
  abort "Runtime artifact #{file} must have kind #{expected_kind}" unless data.fetch("kind") == expected_kind
end

puts "Harness validation passed: #{yaml_files.length} YAML files and required artifacts are present."
RUBY
