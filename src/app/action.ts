"use server";

export interface Brand {
	id: string;
	tipo: string;
	name: string;
}

interface BrandResponse {
	success: boolean;
	result: Brand[];
}

export interface Model {
	id: string;
	tipo: string;
	id_modelo_ano: string;
	fipe_codigo: string;
	id_marca: string;
	marca: string;
	id_modelo: string;
	modelo: string;
	ano: string;
	name: string;
	combustivel: string;
	preco: string;
}

interface ModelResponse {
	success: boolean;
	result: Model[];
}

export interface FiltersType {
	tipo: string;
	id_marca: string;
	id_modelo: string;
	ano: string;
}

export async function getBrands(previousState: unknown, tipo: string) {
	const response = await fetch(`${process.env.API_URL}${tipo}`, {
		headers: {
			"x-rapidapi-proxy-secret": process.env.RAPIDAPI_SECRET ?? "",
		},
	});
	const { result }: BrandResponse = await response.json();

	return result;
}
export async function getModels(previousState: unknown, id_marca: string) {
	const response = await fetch(
		`${process.env.API_URL}?id_marca=${id_marca}&distinctModel`,
		{
			headers: {
				"x-rapidapi-proxy-secret": process.env.RAPIDAPI_SECRET ?? "",
			},
		},
	);
	const { result }: ModelResponse = await response.json();

	return result;
}

export async function getVehicles(
	previousState: unknown,
	filters: FiltersType,
) {
	console.log("filters: ", filters);
	let query = "?";

	const params = Object.keys(filters).filter(
		(param) => filters[param as keyof FiltersType] !== "",
	) as (keyof FiltersType)[];

	for (const param of params) {
		query += `${param}=${filters[param]}&`;
	}

	const response = await fetch(`${process.env.API_URL}${query}`, {
		headers: {
			"x-rapidapi-proxy-secret": process.env.RAPIDAPI_SECRET ?? "",
		},
	});
	const { result }: ModelResponse = await response.json();

	return result;
}
