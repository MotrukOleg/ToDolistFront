import {ConsoleSpanExporter, WebTracerProvider} from '@opentelemetry/sdk-trace-web';
import {BatchSpanProcessor, SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {FetchInstrumentation} from '@opentelemetry/instrumentation-fetch';
import {DocumentLoadInstrumentation} from '@opentelemetry/instrumentation-document-load';
import {registerInstrumentations} from '@opentelemetry/instrumentation';
import {ZoneContextManager} from '@opentelemetry/context-zone';

export const setupTelemetry = () => {


    const provider = new WebTracerProvider();
    (provider as any).addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter()));
    (provider as any).addSpanProcessor(new ConsoleSpanExporter());

    const exporter = new OTLPTraceExporter({
        url: 'https://ingest.eu.signoz.cloud:443',
    });

    provider.register({
        contextManager: new ZoneContextManager(),
    });

    registerInstrumentations({
        instrumentations: [
            new FetchInstrumentation({
                propagateTraceHeaderCorsUrls: /.*/,
            }),
            new DocumentLoadInstrumentation(),
        ],
    });
}