import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { ProfessorsModule } from './professors/professors.module';
import { PeriodsModule } from './periods/periods.module';
import { SubjectsModule } from './subjects/subjects.module';
import { DaysModule } from './days/days.module';
import { SizesModule } from './sizes/sizes.module';
import { SpacesModule } from './spaces/spaces.module';

import { AppController }    from '@app/app.controller';
import { ConfigModule }     from '@config/config.module';
import { SectionsModule }   from '@sections/sections.module';


@Module({
    imports     : [
        ConfigModule,
        SectionsModule,
        ModulesModule,
        ProfessorsModule,
        PeriodsModule,
        SubjectsModule,
        DaysModule,
        SizesModule,
        SpacesModule
    ],
    controllers : [AppController],
    providers   : [],
})
export class AppModule {}
