"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBuild = exports.runWaitUntilTargets = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
// export function runWaitUntilTargets(
//   waitUntilTargets: string[],
//   context: ExecutorContext
// ): Observable<BuilderOutput> {
//   if (!waitUntilTargets || waitUntilTargets.length === 0)
//     return of({ success: true });
//   return zip(
//     ...waitUntilTargets.map(b => {
//       return scheduleTargetAndForget(context, targetFromTargetString(b)).pipe(
//         filter(e => e.success !== undefined),
//         first()
//       );
//     })
//   ).pipe(
//     map(results => {
//       return { success: !results.some(r => !r.success) };
//     })
//   );
// }
function runWaitUntilTargets(waitUntilTargets, context) {
    return Promise.all(waitUntilTargets.map((waitUntilTarget) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const target = devkit_1.parseTargetString(waitUntilTarget);
        const output = yield devkit_1.runExecutor(target, {}, context);
        return new Promise((resolve) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let event = yield output.next();
            // Resolve after first event
            resolve(event.value);
            // Continue iterating
            while (!event.done) {
                event = yield output.next();
            }
        }));
    })));
}
exports.runWaitUntilTargets = runWaitUntilTargets;
function startBuild(options, context) {
    return tslib_1.__asyncGenerator(this, arguments, function* startBuild_1() {
        const buildTarget = devkit_1.parseTargetString(options.buildTarget);
        const buildOptions = devkit_1.readTargetOptions(buildTarget, context);
        if (buildOptions.optimization) {
            // logger.warn(stripIndents`
            //         ************************************************
            //         This is a simple process manager for use in
            //         testing or debugging Node applications locally.
            //         DO NOT USE IT FOR PRODUCTION!
            //         You should look into proper means of deploying
            //         your node application to production.
            //         ************************************************`);
        }
        yield tslib_1.__await(yield* tslib_1.__asyncDelegator(tslib_1.__asyncValues(yield tslib_1.__await(devkit_1.runExecutor(buildTarget, {
            watch: options.watch,
        }, context)))));
    });
}
exports.startBuild = startBuild;
// export function startBuild(
//   options: { buildTarget: string } & JsonObject,
//   context: ExecutorContext
// ): Observable<BuilderOutput> {
//   const target = targetFromTargetString(options.buildTarget);
//   return from(
//     Promise.all([
//       .getTargetOptions(target),
//       context.getBuilderNameForTarget(target)
//     ]).then(([options, builderName]) =>
//       context.validateOptions(context.target.options, context.target)
//     )
//   ).pipe(
//     tap(options => {
//       logger.info(stripIndents`
//               ************************************************
//               This is a custom wrapper of serverless ${context.builder.builderName}
//               ************************************************`);
//     }),
//     concatMap(
//       () =>
//         (scheduleTargetAndForget(context, target, {
//           watch: false
//         }) as unknown) as Observable<BuilderOutput>
//     )
//   );
// }
//# sourceMappingURL=target.schedulers.js.map