import { Express } from 'express';

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile
}                           from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiBody,
    ApiResponse
}                           from '@nestjs/swagger';
import { FileInterceptor }  from '@nestjs/platform-express';

import { SectionsService }      from '@sections/sections.service';
import { CreateSectionDto }     from '@sections/dto/create-section.dto';
import { UpdateSectionDto }     from '@sections/dto/update-section.dto';
import { ProcessedSectionDto }  from '@sections/dto/processed-section.dto';

@ApiTags('sections')
@Controller('sections')
export class SectionsController {
    constructor(private readonly sectionsService: SectionsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new section' })
    @ApiResponse({ status: 201, description: 'The section has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Body() createSectionDto: CreateSectionDto) {
        return this.sectionsService.create(createSectionDto);
    }


    @Post('upload-excel')
    @ApiOperation({ summary: 'Upload and process Excel file with section data' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Excel file with section data'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Excel file processed successfully',
        type: [ProcessedSectionDto]
    })
    @ApiResponse({ status: 400, description: 'Bad Request or invalid file format' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadExcelFile(@UploadedFile() file: Express.Multer.File): Promise<ProcessedSectionDto[]> {
        return this.sectionsService.processExcelFile( file );
    }


    @Get()
    @ApiOperation({ summary: 'Get all sections' })
    @ApiResponse({ status: 200, description: 'Return all sections' })
    findAll() {
        return this.sectionsService.findAll();
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get a section by id' })
    @ApiResponse({ status: 200, description: 'Return the section' })
    @ApiResponse({ status: 404, description: 'Section not found' })
    findOne(@Param('id') id: string) {
        return this.sectionsService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a section' })
    @ApiResponse({ status: 200, description: 'The section has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Section not found' })
    update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
        return this.sectionsService.update(+id, updateSectionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a section' })
    @ApiResponse({ status: 200, description: 'The section has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Section not found' })
    remove(@Param('id') id: string) {
        return this.sectionsService.remove(+id);
    }
}
