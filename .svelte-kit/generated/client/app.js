export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39'),
	() => import('./nodes/40'),
	() => import('./nodes/41'),
	() => import('./nodes/42'),
	() => import('./nodes/43')
];

export const server_loads = [];

export const dictionary = {
		"/(app)": [8,[2]],
		"/(app)/admin": [9,[2,3]],
		"/(app)/admin/evaluations": [10,[2,3]],
		"/(app)/admin/evaluations/[tab]": [11,[2,3]],
		"/(app)/admin/functions": [12,[2,3]],
		"/(app)/admin/functions/create": [13,[2,3]],
		"/(app)/admin/functions/edit": [14,[2,3]],
		"/(app)/admin/settings": [15,[2,3]],
		"/(app)/admin/settings/[tab]": [16,[2,3]],
		"/(app)/admin/users": [17,[2,3]],
		"/(app)/admin/users/[tab]": [18,[2,3]],
		"/auth": [40],
		"/(app)/channels/[id]": [20,[2]],
		"/(app)/c/[id]": [19,[2]],
		"/error": [41],
		"/(app)/home": [21,[2,4]],
		"/(app)/notes": [22,[2,5]],
		"/(app)/notes/[id]": [23,[2,5]],
		"/(app)/playground": [24,[2,6]],
		"/(app)/playground/completions": [25,[2,6]],
		"/s/[id]": [42],
		"/watch": [43],
		"/(app)/workspace": [26,[2,7]],
		"/(app)/workspace/functions/create": [27,[2,7]],
		"/(app)/workspace/knowledge": [28,[2,7]],
		"/(app)/workspace/knowledge/create": [30,[2,7]],
		"/(app)/workspace/knowledge/[id]": [29,[2,7]],
		"/(app)/workspace/models": [31,[2,7]],
		"/(app)/workspace/models/create": [32,[2,7]],
		"/(app)/workspace/models/edit": [33,[2,7]],
		"/(app)/workspace/prompts": [34,[2,7]],
		"/(app)/workspace/prompts/create": [35,[2,7]],
		"/(app)/workspace/prompts/edit": [36,[2,7]],
		"/(app)/workspace/tools": [37,[2,7]],
		"/(app)/workspace/tools/create": [38,[2,7]],
		"/(app)/workspace/tools/edit": [39,[2,7]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.svelte';