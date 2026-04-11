import { BaseService } from "./BaseService";

export class ProfileService extends BaseService {
    constructor() {
        super("/profile");
    }
}
