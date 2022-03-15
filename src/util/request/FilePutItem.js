const constants = require('../constants/constants')

class file{
  item = {
    id : {N : getId()}
  }
}


const getId = () => {
  return String(new Date());
}