import type { Role, User } from "@codepaint/types";

export function hasRole(user: User | null, role: Role): boolean {
  return Boolean(user?.roles.includes(role));
}

export function demoUser(role: Role = "user"): User {
  return { id: "usr_demo", email: role === "recruiter" ? "recruiter@codepaint.studio" : "you@example.com", name: role === "recruiter" ? "招新成员" : "林同学", roles: [role], status: "active" };
}
