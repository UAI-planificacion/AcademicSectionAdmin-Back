import { Injectable } from '@nestjs/common';

import { ENV } from '@config/envs';

export interface SubjectResponse {
    id : string;
    name: string;
}


/**
 * Service to handle external API calls for subjects data
 */
@Injectable()
export class SubjectsService {

	/**
	 * Fetch subjects by IDs from external API
	 * @param subjectIds - Array of subject IDs to fetch
	 * @returns Promise with subjects data from external API
	 */
	async getSubjectsByIds( subjectIds: string[] ): Promise<SubjectResponse[]> {
		try {
			const baseUrl		= ENV().FACULTY_SYSTEM_API;
			const idsParam		= subjectIds.join( ',' );
			const fullUrl		= `${baseUrl}ids/${encodeURIComponent( idsParam )}`;

			const response = await fetch( fullUrl, {
				method		: 'GET',
				headers		: {
					'Content-Type'	: 'application/json',
					'Accept'			: 'application/json',
				},
			});

			if ( !response.ok ) {
				throw new Error( `HTTP error! status: ${response.status}` );
			}

			const data = await response.json();
			return data;

		} catch ( error ) {
			console.error( 'Error fetching subjects from external API:', error );
			throw error;
		}
	}


	/**
	 * Fetch a single subject by ID from external API
	 * @param subjectId - Subject ID to fetch
	 * @returns Promise with subject data from external API
	 */
	async getSubjectById( subjectId: string ): Promise<SubjectResponse> {
		try {
			const baseUrl		= ENV().FACULTY_SYSTEM_API;
			const fullUrl		= `${baseUrl}${subjectId}`;

			const response = await fetch( fullUrl, {
				method		: 'GET',
				headers		: {
					'Content-Type'	: 'application/json',
					'Accept'			: 'application/json',
				},
			});

			if ( !response.ok ) {
				throw new Error( `HTTP error! status: ${response.status}` );
			}

			const data = await response.json();
			return data;

		} catch ( error ) {
			console.error( 'Error fetching subject from external API:', error );
			throw error;
		}
	}

}