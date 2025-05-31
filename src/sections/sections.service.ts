import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ProcessedSectionDto } from './dto/processed-section.dto';
import * as xlsx from 'xlsx';


@Injectable()
export class SectionsService {
    create(createSectionDto: CreateSectionDto) {
        return 'This action adds a new section';
    }

    findAll() {
        return `This action returns all sections`;
    }

    findOne(id: number) {
        return `This action returns a #${id} section`;
    }

    update(id: number, updateSectionDto: UpdateSectionDto) {
        return `This action updates a #${id} section`;
    }

    remove(id: number) {
        return `This action removes a #${id} section`;
    }

    /**
     * Process an Excel file containing section data
     * @param file The uploaded Excel file
     * @returns Array of processed section data
     */
    async processExcelFile(file: Express.Multer.File): Promise<ProcessedSectionDto[]> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Check file type
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || '';
        if (!['xlsx', 'xls'].includes(fileExtension)) {
            throw new BadRequestException('Invalid file format. Only Excel files (.xlsx, .xls) are allowed.');
        }

        try {
            // Read the Excel file
            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            
            // Get the first sheet
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                throw new BadRequestException('Excel file has no sheets');
            }
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            if (!worksheet) {
                throw new BadRequestException('Could not read worksheet');
            }
            
            // Convert sheet to JSON
            const rawData = xlsx.utils.sheet_to_json<ExcelSectionRow>(worksheet);
            
            // Process and validate data
            const processedData = this.processRawData(rawData);
            
            return processedData;
        } catch (error) {
            console.error('Error processing Excel file:', error);
            throw new BadRequestException(`Error processing Excel file: ${error.message}`);
        }
    }

    /**
     * Process raw data from Excel file
     * @param rawData Raw data from Excel file
     * @returns Processed section data
     */
    private processRawData(rawData: ExcelSectionRow[]): ProcessedSectionDto[] {
        if (!rawData || rawData.length === 0) {
            throw new BadRequestException('Excel file is empty or has no valid data');
        }

        return rawData.map((row, index) => {
            if (!row.Sigla || !row.NombreAsignatura || !row.Sec) {
                throw new BadRequestException(`Row ${index + 1} is missing required fields (Sigla, NombreAsignatura, or Sec)`);
            }

            return {
                periodoAcademicoId      : row.PeriodoAcademicoId || '',
                codigoOmega             : row.CodigoOmega || '',
                sigla                   : row.Sigla || '',
                nombreAsignatura        : row.NombreAsignatura || '',
                seccion                 : row.Sec || 0,
                cupoSeccion             : this.#parseNumber( row.CupoSeccion ),
                sala                    : row.Sala || '',
                capacidadSala           : this.#parseNumber( row.Capacidad ),
                tipoSala                : row.TipoSala || '',
                size                    : row.Size || '',
                talla                   : row.Talla || '',
                inscritos               : this.#parseNumber( row.Inscritos ),
                inscritosOriginal       : this.#parseNumber( row.InscritosOriginal ),
                profesor                : row.PROF || '',
                profesorId              : row.ProfesorId || '',
                dia                     : row.Dia || 0,
                modulo                  : row.Modulo || '',
                diff                    : row.Diff,
                edificio                : row.Edificio || '',
                fechaInicio             : row.FechaInicio || '',
                tipoPeriodo             : row.TipoPeriodo || '',
                horario                 : row.Horario || '',
                ssec                    : row.SSEC || '',
                tallaMinimaInscritos    : row.TallaMinimaInscritos || '',
                tallaMinima             : row.TallaMinima || '',
                sillasDisponibles       : this.#parseNumber( row.SillasDisp ),
                informacionAdicional    : row.InformacionAdicional || '',
                codigo                  : row.COD || ''
            };
        });
    }

    /**
     * Parse a value to number, return 0 if invalid
     * @param value Value to parse
     * @returns Parsed number or 0
     */
    #parseNumber( value: any ): number {
        const parsed = parseInt( value, 10 );
        return isNaN(parsed) ? 0 : parsed;
    }
}
