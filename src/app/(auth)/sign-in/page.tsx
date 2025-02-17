// import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default function page() {
  return (
      <form
      >
        <div>Hello</div>
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
