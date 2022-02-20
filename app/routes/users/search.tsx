import type { LoaderFunction } from 'remix';
import { searchAllUsers } from '~/utils/user.actions';

export let loader: LoaderFunction =  async ({ request }) => {
    let url = new URL(request.url);
    let query = url.searchParams.get("q");

    if (!query) {
        return null;
    }

    let results = await searchAllUsers(query, { lean: true });
    return { results: results };
}

