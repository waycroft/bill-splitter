import { useFetcher, Form, useTransition, redirect, json } from "remix";
import { useState, useEffect } from "react";

import type { ActionFunction } from "remix";
import type { LeanUser } from "~/models/UserSchema";
import Chip from "~/components/Chip";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  // todo: because i'm sending multiple at the same time, all the values for 
  // _id are getting placed in a single array, etc.
  // need to pull them back out so that each object is compartmentalized
  console.log(formData);
  return null;
};

export default function NewPoolRoute() {
  const [selectedUsers, setSelectedUsers] = useState<LeanUser[]>([]);
  const transition = useTransition();

  return (
    <div>
      <div>
        <UserSearch
          currentResults={selectedUsers}
          addResult={setSelectedUsers}
        />
      </div>
      <div>
        {selectedUsers.length > 0 ? (
          <ul>
            {selectedUsers.map((user: LeanUser) => {
              return (
                <li key={user._id}>
                  <Chip displayText={user.first_name + " " + user.last_name} />
                </li>
              );
            })}
          </ul>
        ) : (
          ""
        )}
      </div>
      <div>
        {selectedUsers.length > 0 ? (
          <Form method="post" action='/pools/new'>
            {selectedUsers.map((user: LeanUser) => {
              return (
                <div>
                  <input
                    hidden
                    readOnly
                    type="text"
                    name="_id"
                    value={user._id}
                  />
                  <input
                    hidden
                    readOnly
                    type="text"
                    name="first_name"
                    value={user.first_name}
                  />
                  <input
                    hidden
                    readOnly
                    type="text"
                    name="last_name"
                    value={user.last_name}
                  />
                </div>
              );
            })}
            <button className="btn btn-primary rounded" type="submit">
              {transition.submission ? "Creating..." : "Create Pool"}
            </button>
          </Form>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

interface Props {
  currentResults: LeanUser[];
  addResult: React.Dispatch<React.SetStateAction<LeanUser[]>>;
}

function UserSearch({ currentResults, addResult }: Props) {
  const fetcher = useFetcher();

  return (
    <div>
      <fetcher.Form method="post" action={`/users/search`}>
        <fieldset className="input-group rounded-md">
          <label tabIndex={0} className="m-1 text-lg font-bold">
            Add friends to pool
          </label>
          <input
            type="text"
            className="input input-primary max-w-full"
            name="q"
          ></input>
          <button className="btn btn-primary dropdown" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          {fetcher.type === "done" ? (
            <ul
              tabIndex={0}
              className="menu bg-base-200 drop-shadow-lg p-2 dropdown-content rounded-box"
            >
              {fetcher.data.map((user: LeanUser) => {
                return (
                  <li key={user._id}>
                    <a
                      onPointerDown={() => {
                        let combinedSelection = currentResults.concat(user);
                        addResult(combinedSelection);
                      }}
                    >
                      {user.first_name + " " + user.last_name}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : fetcher.submission ? (
            <p>...</p>
          ) : (
            ""
          )}
        </fieldset>
      </fetcher.Form>
    </div>
  );
}
