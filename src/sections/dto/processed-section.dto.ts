import { ApiProperty } from '@nestjs/swagger';

export class ProcessedSectionDto {
    @ApiProperty({ description: 'ID del periodo académico' })
    periodoAcademicoId: string;

    @ApiProperty({ description: 'Código Omega' })
    codigoOmega: string;

    @ApiProperty({ description: 'Sigla de la asignatura' })
    sigla: string;

    @ApiProperty({ description: 'Nombre de la asignatura' })
    nombreAsignatura: string;

    @ApiProperty({ description: 'Número de sección', type: Number })
    seccion: number;

    @ApiProperty({ description: 'Cupo de la sección', type: Number })
    cupoSeccion: number;

    @ApiProperty({ description: 'Sala asignada' })
    sala: string;

    @ApiProperty({ description: 'Capacidad de la sala', type: Number })
    capacidadSala: number;

    @ApiProperty({ description: 'Tipo de sala' })
    tipoSala: string;

    @ApiProperty({ description: 'Tamaño' })
    size: string;

    @ApiProperty({ description: 'Talla' })
    talla: string;

    @ApiProperty({ description: 'Número de inscritos', type: Number })
    inscritos: number;

    @ApiProperty({ description: 'Número original de inscritos', type: Number })
    inscritosOriginal: number;

    @ApiProperty({ description: 'Nombre del profesor' })
    profesor: string;

    @ApiProperty({ description: 'ID del profesor' })
    profesorId: string;

    @ApiProperty({ description: 'Día de la clase', type: Number })
    dia: number;

    @ApiProperty({ description: 'Módulo horario' })
    modulo: string;

    @ApiProperty({ description: 'Diferencia', nullable: true })
    diff: string | null;

    @ApiProperty({ description: 'Edificio' })
    edificio: string;

    @ApiProperty({ description: 'Fecha de inicio' })
    fechaInicio: string;

    @ApiProperty({ description: 'Tipo de periodo' })
    tipoPeriodo: string;

    @ApiProperty({ description: 'Horario' })
    horario: string;

    @ApiProperty({ description: 'SSEC' })
    ssec: string;

    @ApiProperty({ description: 'Talla mínima de inscritos' })
    tallaMinimaInscritos: string;

    @ApiProperty({ description: 'Talla mínima' })
    tallaMinima: string;

    @ApiProperty({ description: 'Sillas disponibles', type: Number })
    sillasDisponibles: number;

    @ApiProperty({ description: 'Información adicional' })
    informacionAdicional: string;

    @ApiProperty({ description: 'Código' })
    codigo: string;
}
