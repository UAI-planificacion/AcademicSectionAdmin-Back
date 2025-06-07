import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { PrismaException }  from '@app/config/prisma-catch';
import { CreateSubjectDto } from '@subjects/dto/create-subject.dto';
import { UpdateSubjectDto } from '@subjects/dto/update-subject.dto';


@Injectable()
export class SubjectsService extends PrismaClient implements OnModuleInit {

    onModuleInit() {
		this.$connect();
	}


    async create( createSubjectDto: CreateSubjectDto ) {
        try {
            const subject = await this.subject.create({ data: createSubjectDto });
            return subject;
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
    }


    async findAll() {
        return this.subject.findMany({});
    }


    async findOne( id: string ) {
        const subject = this.subject.findUnique({ where: { id } });

        if (!subject) {
            throw new NotFoundException( 'Subject not found' );
        }

        return subject;
    }


    async update( id: string, updateSubjectDto: UpdateSubjectDto ) {
        try {
            const subject = await this.subject.update({ where: { id }, data: updateSubjectDto });
            return subject;
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
    }


    async remove( id: string ) {
        try {
            const subject = await this.subject.delete({ where: { id } });
            return subject;
        } catch ( error ) {
            throw PrismaException.catch( error );
        }
    }
}
