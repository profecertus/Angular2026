import { EnvironmentProviders, importProvidersFrom, Provider } from "@angular/core";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { LibrosDataService } from "../shared/libros-data.service";

export const extraProviders: (Provider | EnvironmentProviders)[] = [
    importProvidersFrom(
        InMemoryWebApiModule.forRoot(LibrosDataService,{
            host:'localhost:8080',
            apiBase:'api/',
            delay:400,
            dataEncapsulation:false
        })
    ),
];