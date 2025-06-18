import { PartialType }  from '@nestjs/swagger';

import { BasicSectionDto } from './basic-section.dto';


export class UpdateSectionDto extends PartialType( BasicSectionDto ) {}
