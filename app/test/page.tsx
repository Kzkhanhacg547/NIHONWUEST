import { redirect } from "next/navigation";

export default function TestRedirect() {
  redirect("/app/test");
}

