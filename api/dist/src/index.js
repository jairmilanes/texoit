"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const spinner_service_1 = __importDefault(require("./services/spinner.service"));
const movies_init_service_1 = require("./services/movies.init.service");
const port = process.env.PORT || 3131;
app_1.default.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    spinner_service_1.default.start();
    spinner_service_1.default.prefixText = "Starting server...";
    const count = yield (0, movies_init_service_1.moviewsInit)(process.env.SEED_FILENAME);
    spinner_service_1.default.prefixText = `Server is ready, (${count} Rows)!`;
    spinner_service_1.default.text = `http://localhost:${port}`;
    spinner_service_1.default.stopAndPersist();
}));
exports.default = app_1.default;
