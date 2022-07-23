import * as _ from 'lodash'

export function getChanges (oldObject, newObject) {
  const changes = _.differenceWith(_.toPairs(newObject), _.toPairs(oldObject), _.isEqual)
  return _.fromPairs(changes)
}
