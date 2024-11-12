"use client";

import { useTransition, useActionState, useState, useEffect } from "react";
import { Car } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	type FiltersType,
	getBrands,
	getModels,
	getVehicles,
	type Model,
} from "@/app/action";

export default function VehicleForm() {
	const [state, setState] = useState<FiltersType>({
		tipo: "",
		id_marca: "",
		id_modelo: "",
		ano: "",
	});

	const [IsPending, startTransition] = useTransition();
	const [brands, getBrandsAction] = useActionState(getBrands, []);
	const [models, getModelsAction] = useActionState(getModels, []);
	const [vehicles, getVehiclesAction] = useActionState(getVehicles, []);
	const [vehiclesByYear, setVehiclesByYear] = useState<Model[]>([]);

	useEffect(() => {
		const vehiclesFiltered = vehicles.filter(
			(vehicle) => vehicle.ano === state.ano,
		);

		setVehiclesByYear(vehiclesFiltered);
	}, [state.ano, vehicles]);

	function handlerTypeSelect(value: string) {
		console.log("@@@@@@@@@@@@ handlerTypeSelect", value);
		setState((prevState) => ({ ...prevState, tipo: value }));
		startTransition(async () => {
			try {
				await getBrandsAction(value);
			} catch (error) {
				console.error("Failed to fetch brands:", error);
			}
		});
	}

	function handlerBrandSelect(value: string) {
		console.log("@@@@@@@@@@@@ handlerBrandSelect", value);
		setState((prevState) => ({ ...prevState, id_marca: value }));
		startTransition(async () => {
			try {
				await getModelsAction(value);
			} catch (error) {
				console.error("Failed to fetch brands:", error);
			}
		});
	}

	function handlerModelSelect(value: string) {
		console.log("@@@@@@@@@@@@ handlerModelSelect", value);
		setState((prevState) => ({ ...prevState, id_modelo: value, ano: "" }));
		startTransition(async () => {
			try {
				console.log("state", state);
				await getVehiclesAction({ ...state, id_modelo: value, ano: "" });
			} catch (error) {
				console.error("Failed to fetch brands:", error);
			}
		});
	}

	function handlerModelYear(value: string) {
		console.log("@@@@@@@@@@@@ handlerModelYear", value);
		setState((prevState) => ({ ...prevState, ano: value }));
	}

	return (
		<main className="h-screen flex justify-center pt-32 overflow-hidden">
			<div className="w-[1200px] max-h-[80%]">
				<h1 className="text-4xl">Bem-vindo!</h1>

				<div className="grid grid-cols-[1fr_2fr] gap-9">
					<div className="space-y-4 mt-10">
						<Select onValueChange={handlerTypeSelect}>
							<SelectTrigger>
								<SelectValue placeholder="Escolha um tipo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="carros">Carros</SelectItem>
								<SelectItem value="motos">Motos</SelectItem>
								<SelectItem value="caminhoes">Caminhões</SelectItem>
							</SelectContent>
						</Select>

						<Select onValueChange={handlerBrandSelect}>
							<SelectTrigger disabled={brands.length === 0}>
								<SelectValue placeholder="Escolha uma marca" />
							</SelectTrigger>
							<SelectContent>
								{brands.map((brand) => (
									<SelectItem key={brand.id} value={brand.id}>
										{brand.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select onValueChange={handlerModelSelect}>
							<SelectTrigger disabled={models.length === 0}>
								<SelectValue placeholder="Escolha um modelo" />
							</SelectTrigger>
							<SelectContent>
								{models.map((model) => (
									<SelectItem key={model.id} value={model.id_modelo}>
										{model.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select onValueChange={handlerModelYear}>
							<SelectTrigger disabled={vehicles.length === 0}>
								<SelectValue placeholder="Escolha um modelo" />
							</SelectTrigger>
							<SelectContent>
								{vehicles.map((vehicle) => (
									<SelectItem key={vehicle.id} value={vehicle.ano}>
										{vehicle.ano}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<h1 className="text-xl">
							Veículos disponíveis: {vehiclesByYear.length || vehicles.length}
						</h1>

						{IsPending ? (
							<div className="flex flex-col space-y-10 mt-6">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[200px]" />
								<Skeleton className="h-4 w-[200px]" />
								<Skeleton className="h-4 w-[200px]" />
								<Skeleton className="h-4 w-[200px]" />
							</div>
						) : vehicles.length > 0 ? (
							<ScrollArea className="h-[400px] w-[100%] rounded-md border p-4">
								<ul className="list-disc list-inside mt-2">
									{vehiclesByYear.length > 0
										? vehiclesByYear.map((vehicle) => (
												<li
													key={vehicle.id}
													className="text-lg grid grid-rows mb-3"
												>
													<div className="flex gap-2">
														<Car className="text-blue-700" />
														{vehicle.name} {vehicle.ano}
													</div>

													<div>
														<pre>{JSON.stringify(vehicle, null, 2)}</pre>
													</div>
												</li>
											))
										: vehicles.map((vehicle, index) => (
												<li
													key={vehicle.id}
													className="text-lg grid grid-rows mb-3"
												>
													<Card>
														<CardHeader>
															<CardTitle className="flex gap-2 items-center">
																{index + 1} -
																<Car className="text-blue-700" />
																{vehicle.name}
															</CardTitle>
														</CardHeader>
														<CardContent>
															<pre>{JSON.stringify(vehicle, null, 2)}</pre>
														</CardContent>
													</Card>
												</li>
											))}
								</ul>
							</ScrollArea>
						) : null}
					</div>
				</div>
			</div>
		</main>
	);
}
