import { EnvironmentProviders, importProvidersFrom, Provider } from "@angular/core";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { AppDataService } from "../shared/app-data.service";

export const extraProviders: (Provider | EnvironmentProviders)[] = [
    importProvidersFrom(
        InMemoryWebApiModule.forRoot(AppDataService, {
            host: 'localhost:8080',
            apiBase: 'api/',
            delay: 400,
            dataEncapsulation: false
        })
    ),
];
