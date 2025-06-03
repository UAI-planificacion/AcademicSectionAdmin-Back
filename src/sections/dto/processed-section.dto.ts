import { ApiProperty } from '@nestjs/swagger';

export class ProcessedSectionDto {
    @ApiProperty({ description: 'ID del periodo académico', example: '4008' })
    periodoAcademicoId: string;

    @ApiProperty({ description: 'Código Omega', example: '125142' })
    codigoOmega: string;

    @ApiProperty({ description: 'Sigla de la asignatura', example: 'ACCT212' })
    siglaAsignatura: string;

    @ApiProperty({ description: 'Nombre de la asignatura', example: 'CONTABILIDAD' })
    nombreAsignatura: string;

    @ApiProperty({ description: 'Número de sección', type: Number, example: 0 })
    seccion: number;

    @ApiProperty({ description: 'Cupo de la sección', type: Number, example: 64 })
    cupoSeccion: number;

    @ApiProperty({ description: 'Sala asignada', example: '110-A' })
    sala: string;

    @ApiProperty({ description: 'Capacidad de la sala', type: Number, example: 76 })
    capacidadSala: number;

    @ApiProperty({ description: 'Tipo de sala', example: 'Cátedra' })
    tipoSala: string;

    @ApiProperty({ description: 'Tamaño', example: 'L' })
    size: string;

    @ApiProperty({ description: 'Talla', example: 'L' })
    talla: string;

    @ApiProperty({ description: 'Número de inscritos', type: Number, example: 64 })
    inscritos: number;

    @ApiProperty({ description: 'Número original de inscritos', type: Number, example: 64 })
    inscritosOriginal: number;

    @ApiProperty({ description: 'Nombre del profesor', example: 'DROGUETT, G.' })
    profesor: string;

    @ApiProperty({ description: 'ID del profesor', example: '4566' })
    profesorId: string;

    @ApiProperty({ description: 'Día de la clase', type: Number, example: 2 })
    dia: number;

    @ApiProperty({ description: 'Módulo horario', example: '5' })
    modulo: string;

    @ApiProperty({ description: 'Diferencia', nullable: true, example: '' })
    diff: string | null;

    @ApiProperty({ description: 'Edificio', example: 'A-B' })
    edificio: string;

    @ApiProperty({ description: 'Fecha de inicio', example: '2025-03-05' })
    fechaInicio: string;

    @ApiProperty({ description: 'Tipo de periodo', example: 'Semestre 1' })
    tipoPeriodo: string;

    @ApiProperty({ description: 'Horario', example: '25' })
    horario: string;

    @ApiProperty({ description: 'SSEC', example: 'ACCT212-1' })
    ssec: string;

    @ApiProperty({ description: 'Talla mínima de inscritos', example: 'L' })
    tallaMinimaInscritos: string;

    @ApiProperty({ description: 'Talla mínima', example: 'L' })
    tallaMinima: string;

    @ApiProperty({ description: 'Sillas disponibles', type: Number, example: 12 })
    sillasDisponibles: number;

    @ApiProperty({ description: 'Información adicional', example: '' })
    informacionAdicional: string;

    @ApiProperty({ description: 'Código', example: 'ACCT212-1(L)_C_64_DROGUETT, G.' })
    codigo: string;
}
