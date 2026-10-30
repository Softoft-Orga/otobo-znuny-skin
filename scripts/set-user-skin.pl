use lib "/opt/otobo";
use lib "/opt/otobo/Kernel/cpan-lib";
use Kernel::System::ObjectManager;

my $Skin = $ARGV[0] or die "skin name required\n";
my $Login = $ARGV[1] || 'root@localhost';
local $Kernel::OM = Kernel::System::ObjectManager->new();
my $UserObject = $Kernel::OM->Get("Kernel::System::User");
my %User = $UserObject->GetUserData(User => $Login);
die "agent $Login was not found\n" if !$User{UserID};
my $Ok = $UserObject->SetPreferences(
    UserID => $User{UserID},
    Key    => "UserSkin",
    Value  => $Skin,
);
die "could not set UserSkin\n" if !$Ok;
if ( $Login ne 'root@localhost' ) {
    $UserObject->SetPreferences(
        UserID => $User{UserID},
        Key    => 'UserTimeZone',
        Value  => 'Europe/Berlin',
    );
}
print "UserSkin=$Skin user=$User{UserID} login=$Login\n";
