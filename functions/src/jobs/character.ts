/* eslint-disable prefer-promise-reject-errors */
import { CharacterData } from 'alclient/build/definitions/adventureland-server'
import { DataSnapshot } from 'firebase-functions/lib/providers/database'
import { getChanges } from '../helpers'

export async function submitCharacterData (db, character: CharacterData, owner: string) : Promise<any> {
  const ref = db.ref(`characters/${character.name}`)
  const snapshot = await ref.once('value')
  return await createOrUpdate(snapshot, character, ref, owner)
}

// Create or Update a character record
async function createOrUpdate (snapshot: DataSnapshot, character: CharacterData, ref: any, owner: string): Promise<void> {
  const snapshotData = snapshot.val()
  if (snapshotData?.data) {
    if (snapshotData.owner && snapshotData.owner !== owner) {
      return Promise.reject({ code: 'invalid-owner', status: 401, message: `${owner} is not the owner of ${character.name}` })
    }
    return recordChange(snapshotData, character, ref, owner)
  }
  return createCharacter(character, ref, owner)
}

async function recordChange (snapshotData, character, ref: any, owner: string) {
  const changes = getChanges(snapshotData.data, character)

  if (Object.keys(changes).length) {
    console.log('Changes found')
    return ref.update({
      updatedAt: new Date().toString(),
      isVerified: false,
      data: character,
      owner
    })
  }
}

async function createCharacter (character, ref: any, owner: string) {
  console.log('Creating new character data')
  return ref.update({
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    data: character,
    owner
  })
}
