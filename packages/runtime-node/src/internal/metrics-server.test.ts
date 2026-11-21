import assert from "node:assert/strict";
import { test } from "node:test";

import { appendWorkerMetrics, metricsPortForWorkers } from "./metrics-server.js";

test("validates the complete metrics port range", () => {
	assert.equal(metricsPortForWorkers(undefined, 2), undefined);
	assert.equal(metricsPortForWorkers(65535, 1), 65535);
	assert.equal(metricsPortForWorkers(65534, 2), 65534);
	assert.throws(() => metricsPortForWorkers(65535, 2), /RIVETKIT_METRICS_PORT.*65535/);
});

test("appends escaped Worker identity and process start time without duplicating existing names", () => {
	const result = appendWorkerMetrics("rivet_metric 3", 'a\\b"c\nd', 1, 123.5);
	assert.equal(result, 'rivet_metric 3\n# HELP openorange_worker_info Identifies this Worker.\n# TYPE openorange_worker_info gauge\nopenorange_worker_info{worker="a\\\\b\\"c\\nd",index="1"} 1\n# HELP openorange_worker_start_time_seconds Runtime process start time in seconds.\n# TYPE openorange_worker_start_time_seconds gauge\nopenorange_worker_start_time_seconds 123.5\n');
	assert.equal(appendWorkerMetrics(result, "other", 2, 456), result);
});
