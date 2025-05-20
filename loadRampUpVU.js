import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [{
            duration: '1m', target: 2
        },
        {
            duration: '3m', target: 2
        },
        {
            duration: '30s', target: 4
        },
        {
            duration: '2m', target: 4
        },
        {
            duration: '1m', target: 0
        },
    ],
    // thresholds: {
    //     http_req_failed: ['rate<0.01'],
    //     'http_req_duration{p95:*}': ['<200'],
    // },
};

export default function () {
    const res = http.get('https://test.k6.io');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'page content contains "QuickPizza"': (r) => r.body.includes('QuickPizza'),
    });
    sleep(1);
}