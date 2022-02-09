import { UserModel } from '../models/User.js';
const debug = require('debug')('search')

export async function searchAllUsers(query: string) {
    let results = await UserModel.aggregate([
        {
          '$search': {
            'index': 'user_search',
            'text': {
              'query': query,
              'path': {
                'wildcard': '*'
              }
            }
          }
        }
      ])
    return results;
}

