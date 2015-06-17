import  {LazyVerify, Verify} from 'src/entity-forge/Verify.js'
import  {ValidationError} from 'src/entity-forge/Validation.js'

class EntityBase {

  constructor(typeDefinition) {
    this.typeDefinition = typeDefinition
  }

  validate(){
    let results = this.typeDefinition.validate(this, this.typeDefinition.fieldName)
    if (results.valid === false) {
      throw new ValidationError(results, this.typeDefinition.fieldName)
    }
    return this
  }

  toJson(validate=true){
    if(validate !== false){
      this.validate()
    }
    return JSON.stringify(this)
  }

}

export {EntityBase}

