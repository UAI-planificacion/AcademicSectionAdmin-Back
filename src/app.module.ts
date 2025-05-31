import { Module } from '@nestjs/common';

import { AppController }    from '@app/app.controller';
import { ConfigModule }     from '@config/config.module';
import { SectionsModule }   from '@sections/sections.module';


@Module({
    imports     : [
        ConfigModule,
        SectionsModule
    ],
    controllers : [AppController],
    providers   : [],
})
export class AppModule {}
