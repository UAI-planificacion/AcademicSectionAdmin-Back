import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaException } from '@app/config/prisma-catch';

@Injectable()
export class SizesService extends PrismaClient implements OnModuleInit {
    onModuleInit() {
        this.$connect();
    }


    async create(createSizeDto: CreateSizeDto) {
        // try {
        //     const size = await this.size.create({
        //         data: createSizeDto
        //     });
        //     return size;
        // } catch (error) {
        //     throw PrismaException.catch( error );
        // }
    }

    findAll() {
        return this.size.findMany({});
    }

    findOne(id: string) {
        // return this.size.findUnique({ where: { id } });
    }

    async update(id: string, updateSizeDto: UpdateSizeDto) {
        // try {
        //     const size = await this.size.update({
        //         where: { id },
        //         data: updateSizeDto
        //     });
        //     return size;
        // } catch (error) {
        //     throw PrismaException.catch( error );
        // }
    }

    remove(id: string) {
        // try {
        //     const size = this.size.delete({ where: { id } });
        //     return size;
        // } catch (error) {
        //     throw PrismaException.catch( error );
        // }
    }
}
