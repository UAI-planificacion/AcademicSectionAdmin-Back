import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';

import { AppController }    from '@app/app.controller';
import { ConfigModule }     from '@config/config.module';
import { SectionsModule }   from '@sections/sections.module';


@Module({
    imports     : [
        ConfigModule,
        SectionsModule,
        ModulesModule
    ],
    controllers : [AppController],
    providers   : [],
})
export class AppModule {}
