<script context="module">
    export async function load({fetch}) {
        const res1 = await fetch('/api/OBSOLETE_datapoints.json')
        const res2 = await fetch('/api/OBSOLETE_edges.json')
        const res3 = await fetch('/api/OBSOLETE_feature_datapoints.json')
        if ( res1.ok && res2.ok && res3.ok ) {
            return {
                props: {
                    datapoints: await res1.json(),
                    edges: await res2.json(),
                    feature_datapoints: await res3.json()
                }
            }
        }
    }


</script>

<script>
    export let datapoints
    export let edges
    export let feature_datapoints

    $: console.log(feature_datapoints);
    console.log(datapoints);
    console.log(edges);


    import { selected_datapoints, selected_feature_datapoints } from '../lib/store'
    import { difference, extent } from 'd3';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { schemeCategory10 } from 'd3-scale-chromatic'
    import NodeLink3DCanvas from '../components/NodeLink3DCanvas.svelte';
    import NodeLinkCanvas from '../components/NodeLinkCanvas.svelte';
    import FeatureList from '../components/FeatureList.svelte'
    import { Input, Col, Container, Row } from 'sveltestrap';


    let feature_list = ["","Acetate","Acetone","X__Saturatie","Albumine","Albumine____","Aldosteron","Alfa_1_globulinen","Alfa_2_globulinen","Alkalische_fosfatasen","Antithrombine","Apolipoproteine_A1","Apolipoproteine_B","Basofielen","Beta_globulinen","Bicarbonaat","Bilirubine_totaal","C_peptide_nuchter","Calcium","Calcium__urine_","Calcium_creatinine_ratio","Chloride_creatinine_ratio","Chloriden","Chloriden__urine_","Cholesterol","CK","Complement_C3","Complement_C3d","Complement_C4","Complement_CH50","Cortisol","Creatinine","Creatinine__mg_dL_","CRP_US","Eosinofielen","Eosinofielen_totaal","Ferritine","Foliumzuur_in_serum","Fosfaat","Fosfaat__urine_","Fosfaat_creat__ratio","Gamma_GT","Gamma_globulinen","Gastrine","Glucose","Haptoglobine","HbA1c__IFCC_","HbA1c_bij_niet_diabeticus","HDL_cholesterol","Hematocriet","IgA","IgE_totaal","IgG","IgG_subklasse_2","IgG_subklasse_3","IgG_subklasse_4","IgM","IJzer","Insuline_nuchter","Kalium","Kalium__urine_","Kalium_creatinine_ratio","Koper","LDH","LDL_cholesterol","Leukocyten","Lipase","Lipoproteine__a_","Lymfocyten","Lymfocyten____","Magnesium","Magnesium__urine_","Magnesium_creat__ratio","Monocyten","Natrium","Natrium__urine_","Natrium_creatinine_ratio","Neutrofiele_segmenten","non_HDL_cholesterol","Osmolaliteit","Osmolaliteit__urine_","pH","Proteine_C_activiteit","Proteine_S_vrij","Renine","Soortelijk_gewicht","Totaal_eiwit","Transaminase_ALT__GPT_","Transaminase_AST__GOT_","Transcortine","Transferrine","Triglyceriden","Trombocyten","Ureum","Urinezuur","Urinezuur__mg_dL_","Urinezuur_creat__ratio","Vrij_plasmacortisol","Zink__serum_"]
    // let individuals = ['', 'IAM01', 'IAM02', 'IAM03', 'IAM04', 'IAM05', 'IAM06', 'IAM07', 'IAM08', 'IAM09','IAM10','IAM11','IAM12','IAM13','IAM14','IAM15','IAM16','IAM17','IAM18','IAM19','IAM20','IAM21','IAM22','IAM23', 'IAM24','IAM25','IAM26','IAM27','IAM28','IAM29','IAM30', 'UKB_ID_10392', 'UKB_ID_31678', 'UKB_ID_34316', 'UKB_ID_42729', 'UKB_ID_53616', 'UKB_ID_56597', 'UKB_ID_72995', 'UKB_ID_89168', 'UKB_ID_91060', 'UKB_ID_102159', 'UKB_ID_108595', 'UKB_ID_116102', 'UKB_ID_137089', 'UKB_ID_147641', 'UKB_ID_148001', 'UKB_ID_160004', 'UKB_ID_160317', 'UKB_ID_164882', 'UKB_ID_199850', 'UKB_ID_200649', 'UKB_ID_209744', 'UKB_ID_210854', 'UKB_ID_221937', 'UKB_ID_230170', 'UKB_ID_230731', 'UKB_ID_239960', 'UKB_ID_243882', 'UKB_ID_245806', 'UKB_ID_246057', 'UKB_ID_282340', 'UKB_ID_299221', 'UKB_ID_301928', 'UKB_ID_302789', 'UKB_ID_313340', 'UKB_ID_324129', 'UKB_ID_333442', 'UKB_ID_336509', 'UKB_ID_343550', 'UKB_ID_347557', 'UKB_ID_348250', 'UKB_ID_351787', 'UKB_ID_366083', 'UKB_ID_367110', 'UKB_ID_372162', 'UKB_ID_372345', 'UKB_ID_372889', 'UKB_ID_376014', 'UKB_ID_391558', 'UKB_ID_391771', 'UKB_ID_425870', 'UKB_ID_427496', 'UKB_ID_437540', 'UKB_ID_453853', 'UKB_ID_460559', 'UKB_ID_465699', 'UKB_ID_475633', 'UKB_ID_496626']																																																																																																																																																																																																																																																																																																																																						
    // let individuals = ["","IAM01","IAM02","IAM03","IAM04","IAM05","IAM06","IAM07","IAM08","IAM09","IAM10","IAM11","IAM12","IAM13","IAM14","IAM15","IAM16","IAM17","IAM18","IAM19","IAM20","IAM21","IAM22","IAM23","IAM24","IAM25","IAM26","IAM27","IAM28","IAM29","IAM30"]
    let Profiles = ["", "diagnosed", "not_diagnosed"]
    let individuals = ['', 'UKB_ID_10392', 'UKB_ID_2', 'UKB_ID_3', 'UKB_ID_4', 'UKB_ID_5',
       'UKB_ID_6', 'UKB_ID_7', 'UKB_ID_8', 'UKB_ID_9', 'UKB_ID_10',
       'UKB_ID_11', 'UKB_ID_12', 'UKB_ID_13', 'UKB_ID_14', 'UKB_ID_15',
       'UKB_ID_16', 'UKB_ID_17', 'UKB_ID_18', 'UKB_ID_19', 'UKB_ID_20',
       'UKB_ID_21', 'UKB_ID_22', 'UKB_ID_23', 'UKB_ID_24', 'UKB_ID_25',
       'UKB_ID_26', 'UKB_ID_27', 'UKB_ID_28', 'UKB_ID_29', 'UKB_ID_30',
       'UKB_ID_31', 'UKB_ID_32', 'UKB_ID_33', 'UKB_ID_34', 'UKB_ID_35',
       'UKB_ID_36', 'UKB_ID_37', 'UKB_ID_38', 'UKB_ID_39', 'UKB_ID_40',
       'UKB_ID_41', 'UKB_ID_42', 'UKB_ID_43', 'UKB_ID_44', 'UKB_ID_45',
       'UKB_ID_46', 'UKB_ID_47', 'UKB_ID_48', 'UKB_ID_49', 'UKB_ID_50',
       'UKB_ID_51', 'UKB_ID_52', 'UKB_ID_53', 'UKB_ID_54', 'UKB_ID_55',
       'UKB_ID_56', 'UKB_ID_57', 'UKB_ID_58', 'UKB_ID_59', 'UKB_ID_60',
       'UKB_ID_61', 'UKB_ID_62', 'UKB_ID_63', 'UKB_ID_64', 'UKB_ID_65',
       'UKB_ID_66', 'UKB_ID_67', 'UKB_ID_68', 'UKB_ID_69', 'UKB_ID_70',
       'UKB_ID_71', 'UKB_ID_72', 'UKB_ID_73', 'UKB_ID_74', 'UKB_ID_75',
       'UKB_ID_76', 'UKB_ID_77', 'UKB_ID_78', 'UKB_ID_79', 'UKB_ID_80',
       'UKB_ID_81', 'UKB_ID_82', 'UKB_ID_83', 'UKB_ID_84', 'UKB_ID_85',
       'UKB_ID_86', 'UKB_ID_87', 'UKB_ID_88', 'UKB_ID_89', 'UKB_ID_90',
       'UKB_ID_91', 'UKB_ID_92', 'UKB_ID_93', 'UKB_ID_94', 'UKB_ID_95',
       'UKB_ID_96', 'UKB_ID_97', 'UKB_ID_98', 'UKB_ID_99', 'UKB_ID_100',
       'UKB_ID_101', 'UKB_ID_102', 'UKB_ID_103', 'UKB_ID_104',
       'UKB_ID_105', 'UKB_ID_106', 'UKB_ID_107', 'UKB_ID_108',
       'UKB_ID_109', 'UKB_ID_110', 'UKB_ID_111', 'UKB_ID_112',
       'UKB_ID_113', 'UKB_ID_114', 'UKB_ID_115', 'UKB_ID_116',
       'UKB_ID_117', 'UKB_ID_118', 'UKB_ID_119', 'UKB_ID_120',
       'UKB_ID_121', 'UKB_ID_122', 'UKB_ID_123', 'UKB_ID_124',
       'UKB_ID_125', 'UKB_ID_126', 'UKB_ID_127', 'UKB_ID_128',
       'UKB_ID_129', 'UKB_ID_130', 'UKB_ID_131', 'UKB_ID_132',
       'UKB_ID_133', 'UKB_ID_134', 'UKB_ID_135', 'UKB_ID_136',
       'UKB_ID_137', 'UKB_ID_138', 'UKB_ID_139', 'UKB_ID_140',
       'UKB_ID_141', 'UKB_ID_142', 'UKB_ID_143', 'UKB_ID_144',
       'UKB_ID_145', 'UKB_ID_146', 'UKB_ID_147', 'UKB_ID_148',
       'UKB_ID_149', 'UKB_ID_150', 'UKB_ID_151', 'UKB_ID_152',
       'UKB_ID_153', 'UKB_ID_154', 'UKB_ID_155', 'UKB_ID_156',
       'UKB_ID_157', 'UKB_ID_158', 'UKB_ID_159', 'UKB_ID_160',
       'UKB_ID_161', 'UKB_ID_162', 'UKB_ID_163', 'UKB_ID_164',
       'UKB_ID_165', 'UKB_ID_166', 'UKB_ID_167', 'UKB_ID_168',
       'UKB_ID_169', 'UKB_ID_170', 'UKB_ID_171', 'UKB_ID_172',
       'UKB_ID_173', 'UKB_ID_174', 'UKB_ID_175', 'UKB_ID_176',
       'UKB_ID_177', 'UKB_ID_178', 'UKB_ID_179', 'UKB_ID_180',
       'UKB_ID_181', 'UKB_ID_182', 'UKB_ID_183', 'UKB_ID_184',
       'UKB_ID_185', 'UKB_ID_186', 'UKB_ID_187', 'UKB_ID_188',
       'UKB_ID_189', 'UKB_ID_190', 'UKB_ID_191', 'UKB_ID_192',
       'UKB_ID_193', 'UKB_ID_194', 'UKB_ID_195', 'UKB_ID_196',
       'UKB_ID_197', 'UKB_ID_198', 'UKB_ID_199', 'UKB_ID_200',
       'UKB_ID_201', 'UKB_ID_202', 'UKB_ID_203', 'UKB_ID_204',
       'UKB_ID_205', 'UKB_ID_206', 'UKB_ID_207', 'UKB_ID_208',
       'UKB_ID_209', 'UKB_ID_210', 'UKB_ID_211', 'UKB_ID_212',
       'UKB_ID_213', 'UKB_ID_214', 'UKB_ID_215', 'UKB_ID_216',
       'UKB_ID_217', 'UKB_ID_218', 'UKB_ID_219', 'UKB_ID_220',
       'UKB_ID_221', 'UKB_ID_222', 'UKB_ID_223', 'UKB_ID_224',
       'UKB_ID_225', 'UKB_ID_226', 'UKB_ID_227', 'UKB_ID_228',
       'UKB_ID_229', 'UKB_ID_230', 'UKB_ID_231', 'UKB_ID_232',
       'UKB_ID_233', 'UKB_ID_234', 'UKB_ID_235', 'UKB_ID_236',
       'UKB_ID_237', 'UKB_ID_238', 'UKB_ID_239', 'UKB_ID_240',
       'UKB_ID_241', 'UKB_ID_242', 'UKB_ID_243', 'UKB_ID_244',
       'UKB_ID_245', 'UKB_ID_246', 'UKB_ID_247', 'UKB_ID_248',
       'UKB_ID_249', 'UKB_ID_250', 'UKB_ID_251', 'UKB_ID_252',
       'UKB_ID_253', 'UKB_ID_254', 'UKB_ID_255', 'UKB_ID_256',
       'UKB_ID_257', 'UKB_ID_258', 'UKB_ID_259', 'UKB_ID_260',
       'UKB_ID_261', 'UKB_ID_262', 'UKB_ID_263', 'UKB_ID_264',
       'UKB_ID_265', 'UKB_ID_266', 'UKB_ID_267', 'UKB_ID_268',
       'UKB_ID_269', 'UKB_ID_270', 'UKB_ID_271', 'UKB_ID_272',
       'UKB_ID_273', 'UKB_ID_274', 'UKB_ID_275', 'UKB_ID_276',
       'UKB_ID_277', 'UKB_ID_278', 'UKB_ID_279', 'UKB_ID_280',
       'UKB_ID_281', 'UKB_ID_282', 'UKB_ID_283', 'UKB_ID_284',
       'UKB_ID_285', 'UKB_ID_286', 'UKB_ID_287', 'UKB_ID_288',
       'UKB_ID_289', 'UKB_ID_290', 'UKB_ID_291', 'UKB_ID_292',
       'UKB_ID_293', 'UKB_ID_294', 'UKB_ID_295', 'UKB_ID_296',
       'UKB_ID_297', 'UKB_ID_298', 'UKB_ID_299', 'UKB_ID_300',
       'UKB_ID_301', 'UKB_ID_302', 'UKB_ID_303', 'UKB_ID_304',
       'UKB_ID_305', 'UKB_ID_306', 'UKB_ID_307', 'UKB_ID_308',
       'UKB_ID_309', 'UKB_ID_310', 'UKB_ID_311', 'UKB_ID_312',
       'UKB_ID_313', 'UKB_ID_314', 'UKB_ID_315', 'UKB_ID_316',
       'UKB_ID_317', 'UKB_ID_318', 'UKB_ID_319', 'UKB_ID_320',
       'UKB_ID_321', 'UKB_ID_322', 'UKB_ID_323', 'UKB_ID_324',
       'UKB_ID_325', 'UKB_ID_326', 'UKB_ID_327', 'UKB_ID_328',
       'UKB_ID_329', 'UKB_ID_330', 'UKB_ID_331', 'UKB_ID_332',
       'UKB_ID_333', 'UKB_ID_334', 'UKB_ID_335', 'UKB_ID_336',
       'UKB_ID_337', 'UKB_ID_338', 'UKB_ID_339', 'UKB_ID_340',
       'UKB_ID_341', 'UKB_ID_342', 'UKB_ID_343', 'UKB_ID_344',
       'UKB_ID_345', 'UKB_ID_346', 'UKB_ID_347', 'UKB_ID_348',
       'UKB_ID_349', 'UKB_ID_350', 'UKB_ID_351', 'UKB_ID_352',
       'UKB_ID_353', 'UKB_ID_354', 'UKB_ID_355', 'UKB_ID_356',
       'UKB_ID_357', 'UKB_ID_358', 'UKB_ID_359', 'UKB_ID_360',
       'UKB_ID_361', 'UKB_ID_362', 'UKB_ID_363', 'UKB_ID_364',
       'UKB_ID_365', 'UKB_ID_366', 'UKB_ID_367', 'UKB_ID_368',
       'UKB_ID_369', 'UKB_ID_370', 'UKB_ID_371', 'UKB_ID_372',
       'UKB_ID_373', 'UKB_ID_374', 'UKB_ID_375', 'UKB_ID_376',
       'UKB_ID_377', 'UKB_ID_378', 'UKB_ID_379', 'UKB_ID_380',
       'UKB_ID_381', 'UKB_ID_382', 'UKB_ID_383', 'UKB_ID_384',
       'UKB_ID_385', 'UKB_ID_386', 'UKB_ID_387', 'UKB_ID_388',
       'UKB_ID_389', 'UKB_ID_390', 'UKB_ID_391', 'UKB_ID_392',
       'UKB_ID_393', 'UKB_ID_394', 'UKB_ID_395', 'UKB_ID_396',
       'UKB_ID_397', 'UKB_ID_398', 'UKB_ID_399', 'UKB_ID_400',
       'UKB_ID_401', 'UKB_ID_402', 'UKB_ID_403', 'UKB_ID_404',
       'UKB_ID_405', 'UKB_ID_406', 'UKB_ID_407', 'UKB_ID_408',
       'UKB_ID_409', 'UKB_ID_410', 'UKB_ID_411', 'UKB_ID_412',
       'UKB_ID_413', 'UKB_ID_414', 'UKB_ID_415', 'UKB_ID_416',
       'UKB_ID_417', 'UKB_ID_418', 'UKB_ID_419', 'UKB_ID_420',
       'UKB_ID_421', 'UKB_ID_422', 'UKB_ID_423', 'UKB_ID_424',
       'UKB_ID_425', 'UKB_ID_426', 'UKB_ID_427', 'UKB_ID_428',
       'UKB_ID_429', 'UKB_ID_430', 'UKB_ID_431', 'UKB_ID_432',
       'UKB_ID_433', 'UKB_ID_434', 'UKB_ID_435', 'UKB_ID_436',
       'UKB_ID_437', 'UKB_ID_438', 'UKB_ID_439', 'UKB_ID_440',
       'UKB_ID_441', 'UKB_ID_442', 'UKB_ID_443', 'UKB_ID_444',
       'UKB_ID_445', 'UKB_ID_446', 'UKB_ID_447', 'UKB_ID_448',
       'UKB_ID_449', 'UKB_ID_450', 'UKB_ID_451', 'UKB_ID_452',
       'UKB_ID_453', 'UKB_ID_454', 'UKB_ID_455', 'UKB_ID_456',
       'UKB_ID_457', 'UKB_ID_458', 'UKB_ID_459', 'UKB_ID_460',
       'UKB_ID_461', 'UKB_ID_462', 'UKB_ID_463', 'UKB_ID_464',
       'UKB_ID_465', 'UKB_ID_466', 'UKB_ID_467', 'UKB_ID_468',
       'UKB_ID_469', 'UKB_ID_470', 'UKB_ID_471', 'UKB_ID_472',
       'UKB_ID_473', 'UKB_ID_474', 'UKB_ID_475', 'UKB_ID_476',
       'UKB_ID_477', 'UKB_ID_478', 'UKB_ID_479', 'UKB_ID_480',
       'UKB_ID_481', 'UKB_ID_482', 'UKB_ID_483', 'UKB_ID_484',
       'UKB_ID_485', 'UKB_ID_486', 'UKB_ID_487', 'UKB_ID_488',
       'UKB_ID_489', 'UKB_ID_490', 'UKB_ID_491', 'UKB_ID_492',
       'UKB_ID_493', 'UKB_ID_494', 'UKB_ID_495', 'UKB_ID_496',
       'UKB_ID_497', 'UKB_ID_498', 'UKB_ID_499', 'UKB_ID_500', 'UKB_ID_10392', 'UKB_ID_31678', 'UKB_ID_34316', 'UKB_ID_42729', 'UKB_ID_53616', 'UKB_ID_56597', 'UKB_ID_72995', 'UKB_ID_89168', 'UKB_ID_91060', 'UKB_ID_102159', 'UKB_ID_108595', 'UKB_ID_116102', 'UKB_ID_137089', 'UKB_ID_147641', 'UKB_ID_148001', 'UKB_ID_160004', 'UKB_ID_160317', 'UKB_ID_164882', 'UKB_ID_199850', 'UKB_ID_200649', 'UKB_ID_209744', 'UKB_ID_210854', 'UKB_ID_221937', 'UKB_ID_230170', 'UKB_ID_230731', 'UKB_ID_239960', 'UKB_ID_243882', 'UKB_ID_245806', 'UKB_ID_246057', 'UKB_ID_282340', 'UKB_ID_299221', 'UKB_ID_301928', 'UKB_ID_302789', 'UKB_ID_313340', 'UKB_ID_324129', 'UKB_ID_333442', 'UKB_ID_336509', 'UKB_ID_343550', 'UKB_ID_347557', 'UKB_ID_348250', 'UKB_ID_351787', 'UKB_ID_366083', 'UKB_ID_367110', 'UKB_ID_372162', 'UKB_ID_372345', 'UKB_ID_372889', 'UKB_ID_376014', 'UKB_ID_391558', 'UKB_ID_391771', 'UKB_ID_425870', 'UKB_ID_427496', 'UKB_ID_437540', 'UKB_ID_453853', 'UKB_ID_460559', 'UKB_ID_465699', 'UKB_ID_475633', 'UKB_ID_496626']																																																																																																																																																																																																																																																																																																																																						
    let metabolites_features_list = ['', 'Apolipoproteine A1', 'C reactive protein', 'Calcium', 'Cholesterol', 'Creatinine', 'Gamma glutamyltransferase', 'Glucose', 'Glycated haemoglobine HbA1c', 'HDL-cholesterol', 'IGF 1', 'LDL direct', 'Oestron', 'Phosphate', 'Reumafactor', 'SHBG', 'Testosteron', 'Total bilirubin', 'Total protein', 'Triglycerides', 'Urate', 'Ureum', 'Vitamin D']

    let lowColor = "#edf8b1"
    let highColor = "#2c7fb8"

    // const classColorScale = (d) => {
    //     return scaleOrdinal(schemeCategory10).range()[d["class"]]
    // }

    let colorScales = {}
    $: {
        metabolites_features_list.forEach((f) => {
            let values = Object.values(datapoints).map((d) => { return d[f] })
            let colorScale = (d) => {
                return scaleLinear().domain(extent(values)).range([lowColor,highColor])(d[f])
            }
            colorScales[f] = colorScale
        })
        colorScales['gender'] = (d) => {
            if (d["gender"] == "M" ) { return "blue" }
            else { return "pink" }
        }
    }
    


    // let colorScale;
    let selectedColorScale = "";
    let selectedIndividual;
    let selectedProfile;


    $: {
        if ( selectedIndividual ) {
            $selected_datapoints = {}
            if ( selectedIndividual != "" ) {
                // selectedColorScale = "eccentricity"
                let individual_objects = Object.values(datapoints)
                                            .filter((d) => { return d.individual == selectedIndividual })
                                            .map(d => { return d["_id"]})
                individual_objects.forEach((ind) => { $selected_datapoints[ind] = true })
            }
        }
    }

    $:console.log(selectedIndividual)
    $:console.log(selectedProfile)

    $: colorScale = colorScales[selectedColorScale]

    $: {
         if ( selectedProfile ) {
            $selected_datapoints = {}
            if ( selectedProfile != "" ) {
                // selectedColorScale = "eccentricity"
                let individual_objects = Object.values(datapoints)
                // d.individual refers to individual column in data, that gets filtered out and the data of _id is returned
                                            .filter((d) => { return d.profile == selectedProfile })
                                            .map(d => { return d["_id"]})
   // The (prof) thing is linked to the select profile button that is defined below!! analogue to individual button
                individual_objects.forEach((prof) => { $selected_datapoints[prof] = true })
            }
        }
    }



    let colorScaleFeature = scaleLinear().domain([-1,0,1]).range(["#296e2b","#ffffbf","#d40808"])


    $: value_difference = (n) => {
        let all_dp = Object.values(datapoints)
                            .sort((a,b) => { return a[n["_key"]] - b[n["_key"]] } )
                            .map(d => { return d[n["_key"]]})

        let selected_dp = Object.values(datapoints)
                                .filter((d) => { return $selected_datapoints[d.id] })
                                .sort((a,b) => { return a[n["_key"]] - b[n["_key"]] } )
                                .map(d => { return d[n["_key"]]})

                                // console.log(selected_dp.length)

        let median_selected = selected_dp[Math.floor(selected_dp.length/2)]

        // console.log(median_selected)
        
        let rest_dp = Object.values(datapoints)
                            .filter((d) => { return ! $selected_datapoints[d.id] })
                            .sort((a,b) => { return a[n["_key"]] - b[n["_key"]] } )
                            .map(d => { return d[n["_key"]]})
        let median_rest = rest_dp[Math.floor(rest_dp.length/2)]
        // console.log(median_rest)


        let q75 = all_dp[Math.floor(all_dp.length*0.75)]
        let q25 = all_dp[Math.floor(all_dp.length*0.25)]
        let iqr = q75-q25

        // console.log(iqr)
        // console.log(all_dp.length)

        // console.log(q75)
        // console.log(q25)





        let difference = (median_selected - median_rest)/iqr
        
        // console.log(difference)

        return difference
    }
// $:console.log(value_difference(n))
// in order to see what the differences are in order to properly map towards an appropriate scale
// $:console.log(difference)

</script>

<h1>STAD</h1>
Colour scheme datapoints:
<Input type="select" name="select" id="colourSchemeSelect" bind:value={selectedColorScale}>
    {#each metabolites_features_list as f}
        <option>{f}</option>
    {/each}
</Input>
Select individual:
<Input type="select" name="select" id="individualSelect" bind:value={selectedIndividual}>
    {#each individuals as ind}
        <option>{ind}</option>
    {/each}
</Input>
Select phenotype group:
<Input type = "select" name="select" id="ProfileColourSelect" bind:value={selectedProfile}>
    {#each Profiles as prof}
    <option>{prof}</option>
    {/each}
</Input>

<Container fluid>
    <Row>
        <Col><NodeLink3DCanvas bind:datapoints={datapoints} edges={edges}
            bind:selected={$selected_datapoints}
            nodecolor_function={(node) => { if ( $selected_datapoints[node.id] ) { return "red" } else { return colorScale(node) }}}/>
        </Col>
        <Col><NodeLinkCanvas bind:datapoints={datapoints} edges={edges}
            bind:selected={$selected_datapoints}
            nodecolor_function={(node) => { if ( $selected_datapoints[node.id] ) { return "red" } else { return colorScale(node) }}}/>
        </Col>
    </Row>
    <Row>
        <Col>
            {#if ( Object.keys($selected_datapoints).length > 0 )}
            <FeatureList bind:datapoints={feature_datapoints}
            order_function={(node) => { return value_difference(node) }}
            color_function={(node) => { return colorScaleFeature(value_difference(node))}} />
            {/if}
        </Col>
    </Row>
</Container>

