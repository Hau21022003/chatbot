import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsExistConstraint } from 'src/common/validators/is-exist-constraint.validator';
import { EntityTarget } from 'typeorm';

export function IsExists(
  entity: EntityTarget<any>,
  column?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, column],
      validator: IsExistConstraint,
    });
  };
}
