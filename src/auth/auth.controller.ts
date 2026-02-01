import { Controller, Post, Get, UseGuards, Body, Headers } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger"
import  { AuthService } from "./auth.service"
import { JwtAuthGuard } from "./jwt-auth.guard"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"

@ApiTags('Authentication')
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  @ApiOperation({ summary: 'Login user', description: 'Authenticate user and return JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
  
  @Post("register")
  @ApiOperation({ summary: 'Register new user', description: 'Create a new user account and return JWT token' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Registration successful', schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } })
  @ApiResponse({ status: 400, description: 'Bad request - email already exists or invalid data' })
  async register(@Body() body: RegisterDto) {
    const { email, password, firstName, lastName, name } = body;
    
    // Support both 'name' directly or 'firstName + lastName'
    const userName = name || `${firstName || ''} ${lastName || ''}`.trim();
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    return this.authService.register({ email, password, name: userName });
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile', description: 'Get authenticated user profile information' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Headers() header: { authorization: string }) {
    return this.authService.getProfile(header.authorization);
  }
}
