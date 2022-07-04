import type { NextPage } from "next";
import { useRef } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const users = trpc.useQuery(["users"]);
  const utils = trpc.useContext();
  const createAccount = trpc.useMutation(["create_account"], {
    onSuccess: () => {
      utils.invalidateQueries("users");
    },
  });

  const inputRef = useRef<null | HTMLInputElement>(null);
  if (!users.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = inputRef.current?.value;
          if (!name) return;
          createAccount.mutate({
            name,
          });
        }}
      >
        <input placeholder="new acc name" ref={inputRef} />
        <button type="submit">submit</button>
      </form>
      <div style={{ display: "flex", flexDirection: "column-reverse" }}>
        {users.data.map((user) => (
          <div key={user.name}>
            <br />
            <p>{user.name}</p>
            <p>{user.memberSince.toLocaleString()}</p>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
