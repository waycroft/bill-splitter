import type { ActionFunction } from 'remix';
import { searchAllUsers } from '~/utils/user.actions';

export let action: ActionFunction =  async ({ request }) => {
    let formData = await request.formData();
    let query = formData.get('q');

    if (!query) {
        return null;
    }

    let results = await searchAllUsers(query.toString(), { lean: true });
    return results;
}