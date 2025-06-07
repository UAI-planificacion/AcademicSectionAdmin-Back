import { Module } from '@nestjs/common';

import { SpacesService }    from '@spaces/spaces.service';
import { SpacesController } from '@spaces/spaces.controller';


@Module({
    controllers : [SpacesController],
    providers   : [SpacesService],
})
export class SpacesModule {}
