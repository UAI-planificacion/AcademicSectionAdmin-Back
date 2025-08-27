import { Module } from '@nestjs/common';

import { SectionsService }		from '@sections/sections.service';
import { SectionsController }   from '@sections/sections.controller';
import { SubjectsService }      from '@sections/services/subjects.service';


@Module({
	controllers	: [SectionsController],
	providers	: [SectionsService, SubjectsService],
})
export class SectionsModule {}
