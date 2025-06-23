import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [EntityClass, column = 'id'] = args.constraints;
    const repo = this.dataSource.getRepository(EntityClass);
    const record = await repo.findOne({ where: { [column]: value } });
    return !!record;
  }

  defaultMessage(args: ValidationArguments) {
    const [EntityClass, column = 'id'] = args.constraints;
    return `${column} does not exist in ${EntityClass.name}`;
  }
}
