// database/migrations/xxxx_add_social_login_to_users_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('github_id')->nullable()->unique();
            $table->string('avatar')->nullable();
            $table->string('provider')->nullable(); // 'email', 'github', dll
            $table->string('password')->nullable()->change(); // Buat password nullable
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['github_id', 'avatar', 'provider']);
            $table->string('password')->nullable(false)->change();
        });
    }
};
