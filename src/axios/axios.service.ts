import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosService {
  constructor(private instance: AxiosInstance = axios.create()) {}

  async get<Result>(url: string, body?: unknown): Promise<Result> {
    return (await this.instance.get<Result>(url, body)).data;
  }

  async post<Result>(url: string, body?: unknown): Promise<Result> {
    return (await this.instance.post<Result>(url, body)).data;
  }
}
