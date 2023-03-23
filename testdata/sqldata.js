"use strict";
exports.__esModule = true;
exports.addTable = exports.addCorp = exports.removeTable = exports.removeCorp = void 0;
exports.removeCorp = "\nDELETE FROM public.\"Corporation\" WHERE id = 'testcorp';\n";
exports.removeTable = "\nDELETE FROM public.\"Desk\";\n";
exports.addCorp = "\nINSERT INTO public.\"Corporation\" (id, name) VALUES ('testcorp', 'Test Corporate');\n";
exports.addTable = "\nINSERT INTO public.\"Desk\" (table_name, is_occupied, corporation_id) \nVALUES \n    ('TS01', false, 'testcorp'),\n    ('TS02', false, 'testcorp'),\n    ('TS03', false, 'testcorp'),\n    ('TS04', false, 'testcorp'),\n    ('TS05', false, 'testcorp'),\n    ('TS06', false, 'testcorp'),\n    ('TS07', false, 'testcorp'),\n    ('TS08', false, 'testcorp'),\n    ('TS09', false, 'testcorp'),\n    ('TS10', false, 'testcorp'),\n    ('TS11', false, 'testcorp'),\n    ('TS12', false, 'testcorp'),\n    ('TS13', false, 'testcorp'),\n    ('TS14', false, 'testcorp'),\n    ('TS15', false, 'testcorp'),\n    ('TS16', false, 'testcorp'),\n    ('TS17', false, 'testcorp'),\n    ('TS18', false, 'testcorp')\n;\n";
