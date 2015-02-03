class BackboneGenerator {
  create(classType, name, options) {
    const CREATE_STRING = `onCreate${classType.charAt(0).toUpperCase()
      + classType.slice(1)}`;

    this.options = (options || {});

    let hasMethod = Object.getOwnPropertyNames(BackboneGenerator.prototype)
      .indexOf(CREATE_STRING) > -1;

    if (! hasMethod) {
      throw new Error(
        `Invalid generator class type ${classType}, ` +
        `BackboneGenerator has no method ${CREATE_STRING}`
      );
    }

    this[CREATE_STRING](name, options);
  }

  onCreateModel(name, options) {

  }

  onCreateCollection(name, options) {

  }

  onCreateView(name, options) {

  }

  onCreateTemplate(name, options) {

  }

  onCreateRouter(name, options) {

  }
}

export default new BackboneGenerator();
