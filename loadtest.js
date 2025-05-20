import http from 'k6/http';
import { check, sleep} from 'k6';
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 2,
    duration: '30s',
};

export default function () {
    const res = http.get('https://test.k6.io');
    sleep(1);

    check(res, {'status was 200': (r) => r.status === 200,
        'response time is less than 200ms': (r) => r.timings.duration < 200,
    });   
}

export function handleSummary(data) {
    return {
        'loadTest.html': htmlReport(data),
        stdout: textSummary(data, {
            indent: "",
            enableColors: true
        }),
    }

};