import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { PrismaException }  from '@app/config/prisma-catch';
import { UpdateDayDto }     from '@days/dto/update-day.dto';


@Injectable()
export class DaysService extends PrismaClient implements OnModuleInit {
    onModuleInit() {
        this.$connect();
    }

    findAll() {
        return this.day.findMany({});
    }

    findOne( id: number ) {
        return this.day.findUnique({ where: { id } });
    }

    async update( id: number, updateDayDto: UpdateDayDto ) {
        try {
            const day = await this.day.update({
                where: { id },
                data: updateDayDto
            });
            return day;
        } catch (error) {
            throw PrismaException.catch( error );
        }
    }

}
