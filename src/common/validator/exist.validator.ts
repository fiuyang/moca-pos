import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const find = {
      where: {
        [args.constraints[1]]: args.value,
      },
    };

    const check = await this.entityManager
      .getRepository(args.constraints[0])
      .findOne(find);

    if (!check) {
      return false;
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return args.property + ' ' + args.value + ' not found';
  }
}

export function IsExist(option: any, validationOption?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: option,
      options: validationOption,
      validator: ExistValidator,
      async: true,
    });
  };
}
