import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient, SizeValue as PrismaSizeValue } from '@prisma/client';

import { PrismaException }              from '@app/config/prisma-catch';
import { CreateSizeDto, SizeValueDto }  from '@sizes/dto/create-size.dto';
import { UpdateSizeDto }                from '@sizes/dto/update-size.dto';


@Injectable()
export class SizesService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }


    #generateDetail( dto: CreateSizeDto | UpdateSizeDto ): string {
        const { min, max, lessThan, greaterThan } = dto;

        if ( lessThan )     return `< ${lessThan}`;
        if ( greaterThan )  return `> ${greaterThan}`;

        return `${min} - ${max}`;
    }


    async create( createSizeDto: CreateSizeDto ) {
        try {
            const size = await this.size.create({
                data:  {
                    ...createSizeDto,
                    id: createSizeDto.id as PrismaSizeValue,
                    detail: this.#generateDetail( createSizeDto ),
                },
            });
            return size;
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
    }


    findAll() {
        return this.size.findMany({});
    }


    findOne( id: SizeValueDto ) {
        return this.size.findUnique({ where: { id }});
    }


    async update( id: SizeValueDto, updateSizeDto: UpdateSizeDto ) {
        try {
            const size = await this.size.update({
                where: { id },
                data: {
                    ...updateSizeDto,
                    detail: this.#generateDetail( updateSizeDto ),
                }
            });
            return size;
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
    }


    async remove( id: SizeValueDto ) {
        try {
            const size = await this.size.delete({ where: { id }});
            return size;
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
    }
}
