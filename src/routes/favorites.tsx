import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Cars | AWA AUTO MALL" }] }),
  component: () => <Navigate to="/cars" replace />,
});
