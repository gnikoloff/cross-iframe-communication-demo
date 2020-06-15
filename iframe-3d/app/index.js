import {
  getIframeName,
} from '../../shared/helpers'

const playerName = getIframeName(window.location.search)
console.log(playerName)
