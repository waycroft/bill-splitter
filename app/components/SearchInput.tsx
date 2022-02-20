import { useFetcher, useSubmit, Form, useActionData, useTransition } from 'remix';
import { useEffect } from 'react';

import type { LeanUser } from '~/models/UserSchema';

export default function SearchInput({ collection }: { collection: "users" }) {
    const transition = useTransition();
    const userSearch = useFetcher();

    return (
        <div>
            <userSearch.Form method='get' action='users/search'>
                <label>Search</label>
                <input name="searchInput"></input>
                <button name="_action" value="search" type="submit">
                    { transition.state === "submitting" ? "searching..." : "Search" }
                </button>
            </userSearch.Form>
            { userSearch.data.results ? 
            <ol>
                { userSearch.data.results.map((user: LeanUser) => {
                    return (
                        <li>{user.first_name + " " + user.last_name}</li>
                    )    
                })}
            </ol> : ""}
        </div>
    )
}