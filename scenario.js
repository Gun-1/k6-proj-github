import http from 'k6/http';
import { check, sleep } from 'k6';
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  scenarios: {
    homepageLoad: {
      executor: 'constant-vus',
      vus: 50,
      duration: '1m', // Reduced for example
      exec: 'visitHomepage',
    },
    accessLogin: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'accessLoginForm',
    },
    checkoutProcess: {
      executor: 'constant-vus',
      vus: 2,
      duration: '30s', // Reduced for example
      exec: 'accessAdminForm',
    },
  },
};

export default function(){
    const res = http.get('https://test.k6.io');
    check(res,{
        'status was 200': (r) => r.status === 200,
        'verify homepage text': (r)=>
            r.body.includes('Looking to break out of your pizza routine?')
    })
}

export function visitHomepage() {
  http.get('https://test.k6.io');
  sleep(1);
}

export function accessLoginForm() {
  http.get('https://quickpizza.grafana.com/login');
  sleep(1);
}

export function accessAdminForm() {
  http.get('https://quickpizza.grafana.com/admin');
  sleep(1);
}

export function handleSummary(data) {
    return {
        'reportScenario.html': htmlReport(data),
        stdout: textSummary(data, {
            indent: "",
            enableColors: true
        })
    }
}